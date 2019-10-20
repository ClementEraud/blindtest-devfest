<template>
    <v-container class="fill-height" fluid id="score_container">
        <svg id="bar_score" :height="svgHeight" :width="svgWidth" />
    </v-container>
</template>

<script>
    import *  as d3 from "d3"

    import { ipcRenderer } from "electron";
    import { eventTypes } from "@/enums/events.js";

    export default {
        name: 'GamePlay',
        components: { },
        data: () => ({
            colorLock: {},
            colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
            scores: [ ],

            height: 0,
            width: 0,
            margin: { top: 0, right: 0, bottom: 25, left: 0 },

            g: null,

            svg: null,
            svgWidth: null,

            xAxis: null,
            xScale: null,

            yAxis: null,
            yScale: null
        }),
        computed: {
            svgHeight () { return this.svgWidth / 1.618 }
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.resize)
        },
        methods: {
            init() {
                this.svg = d3.select("svg")
                    .attr("width", this.svgWidth)
                    .attr("height", this.svgHeight)

                this.width = this.svg.attr("width") - this.margin.left - this.margin.right
                this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom

                this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

                this.xScale = d3.scaleBand().range([0, this.width]).domain(this.players.map((p) => p.name)).padding(0.05)
                this.xAxis = this.g.append("g").attr("class", "axis")
                    .attr("transform", "translate(0, " + this.height + ")")
                    .call(d3.axisBottom(this.xScale))
                this.xAxis.select(".domain").remove()
                this.xAxis.selectAll("text").style("font-size", 16).text((d) => d);

                this.yScale = d3.scaleLinear().range([this.height, 0]).domain([0, 10]);
            },
            draw() {
                this.g.selectAll(".bar")
                    .data(this.scores)
                        .enter().append("rect")
                            .attr("class", "bar")
                            .attr("fill", (d, i) => this.colors[i])
                            .attr("x", (d) => this.xScale(d.player))
                            .attr("width", this.xScale.bandwidth())
                            .attr("y", (d) => this.yScale(d.score))
                            .attr("height", (d) => this.height - this.yScale(d.score));

                this.g.selectAll(".arc")
                    .data(this.scores)
                        .enter().append("path")
                            .attr("class", "arc")
                            .attr("transform", (d) => {
                                return "translate(" + (this.xScale(d.player) + this.xScale.bandwidth() - this.xScale.bandwidth()/2) + "," + this.yScale(d.score) + ")"
                            })
                            .attr("d", d3.arc()
                                .innerRadius(0)
                                .outerRadius(50)
                                .startAngle( -Math.PI / 2 )
                                .endAngle(Math.PI / 2 ))
                            .attr('stroke', 'black')
                            .attr('fill', (d, i) => this.colors[i])
                            .transition().call(this.inhale);
            },
            resize() {
                this.svgWidth = document.getElementById("score_container").offsetWidth

                this.svg.attr("width", this.svgWidth).attr("height", this.svgHeight)

                this.width = this.svg.attr("width") - this.margin.left - this.margin.right
                this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom

                this.xScale.rangeRound([0, this.width])
                this.yScale.rangeRound([this.height, 0])

                this.xAxis.attr("transform", "translate(0, " + this.height + ")")
                    .call(d3.axisBottom(this.xScale))
                this.xAxis.select(".domain").remove()

                this.g.selectAll(".bar")
                    .attr("x", (d) => this.xScale(d.player))
                    .attr("width", this.xScale.bandwidth())
                    .attr("y", (d) => this.yScale(d.score))
                    .attr("height", (d) => this.height - this.yScale(d.score));

                this.g.selectAll(".arc")
                    .attr("transform", (d) => {
                        return "translate(" + (this.xScale(d.player) + this.xScale.bandwidth() - this.xScale.bandwidth()/2) + "," + this.yScale(d.score) + ")"
                    })
                    
            },
            updatePlayerScore(player) {
                const index = this.scores.findIndex(score => score.player === player.name)
                this.scores[index].score = player.score

                this.update()
            },
            update() {
                const color_white = "rgb(255, 255, 255)"

                this.g.selectAll(".bar")
                    .data(this.scores)
                    .transition().call(this.updateScore)

                this.g.selectAll(".arc")
                    .data(this.scores)
                    .filter(function(d) {
                        return d3.select(this).attr("stroke") !== color_white && d >= 1
                    })
                    .call(this.updateColor)
            },
            
            // Animations
            exhale(transition) {
                const inhaleAux =  this.inhale
                transition
                    .duration(2000).ease(d3.easeCubicInOut)
                    .attr("d", d3.arc()
                    .innerRadius(0)
                    .outerRadius(50)
                    .startAngle( -Math.PI / 2 )
                    .endAngle(Math.PI / 2 ))
                    .on("end", function () { d3.select(this).transition().call(inhaleAux); });
            },
            inhale(transition) {
                const exhaleAux = this.exhale
                transition
                    .duration(3000).ease(d3.easeCubicInOut)
                    .attr("d", d3.arc()
                    .innerRadius(0)
                    .outerRadius(60)
                    .startAngle( -Math.PI / 2 )
                    .endAngle(Math.PI / 2 ))
                    .on("end", function () { d3.select(this).transition().call(exhaleAux); });
            },
            updateColor(arc) {
                d3.select(this.colorLock)
                    .transition()
                    .duration(1000)
                    .tween("attr:color", function() {
                        var i = d3.interpolateRgb("black", "white");
                        return function(t) { arc.attr("stroke", i(t)); };
                    });
            },
            updateScore(transition) {
                transition.duration(1000).ease(d3.easeLinear)
                    .attr("y", (d) => this.yScale(d.score))
                    .attr("height", (d) => this.height - this.yScale(d.score))
            }
        },
        mounted() {
            this.svgWidth = document.getElementById("score_container").offsetWidth
            window.addEventListener("resize", this.resize)

            this.scores = this.players.map((p) => { return { player: p.name, score: 0 }})

            this.init()

            this.draw()

            ipcRenderer.on(eventTypes.scoreUpdate, (e, player) => {
                this.updatePlayerScore(player)
            });
        },
        props: {
            players: Array
        },
        watch: {
            svgWidth() {
                this.svgWidth = document.getElementById("score_container").offsetWidth
            },
            scores() {
                this.update()
            }
        }
    }
</script>

<style scoped>
</style>